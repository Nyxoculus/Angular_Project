import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import Konva from 'konva';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  InventoryItem,
  SHOP_AMMO,
  SHOP_WEAPONS,
  ShopAmmo,
  ShopWeapon,
} from './inventory.model';

const GRID_COLS = 4;
const BASE_ROWS = 2;
const CELL = 64;
const GRID_X = 12;
const GRID_Y = 64;
const MAX_EXPANSIONS = 4;
const EXPANSION_PRICE = 200;
const MONEY_START = 1000;
const MONEY_STEP = 100;

@Component({
  selector: 'app-task1-b',
  templateUrl: './task1-b.component.html',
  styleUrls: ['./task1-b.component.less'],
  standalone: false,
})
export class Task1BComponent implements AfterViewInit, OnDestroy {
  @ViewChild('konvaContainer', { static: true })
  konvaContainer!: ElementRef<HTMLDivElement>;

  readonly weapons = SHOP_WEAPONS;
  readonly ammo = SHOP_AMMO;
  readonly maxExpansions = MAX_EXPANSIONS;
  readonly expansionPrice = EXPANSION_PRICE;

  money = signal<number>(MONEY_START);
  items = signal<InventoryItem[]>([]);
  ownedWeaponIds = signal<string[]>([]);
  expansionsBought = signal<number>(0);
  selectedUid = signal<string | null>(null);

  private stage?: Konva.Stage;
  private gridLayer?: Konva.Layer;
  private itemsLayer?: Konva.Layer;

  constructor(private readonly message: NzMessageService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.stage = new Konva.Stage({
        container: this.konvaContainer.nativeElement,
        width: this.stageWidth(),
        height: this.stageHeight(),
      });
      this.gridLayer = new Konva.Layer();
      this.itemsLayer = new Konva.Layer();
      this.stage.add(this.gridLayer);
      this.stage.add(this.itemsLayer);
      this.redraw();
    });
  }

  ngOnDestroy(): void {
    this.stage?.destroy();
  }

  private capacity(): number {
    return BASE_ROWS * GRID_COLS + 2 * this.expansionsBought();
  }

  private maxRows(): number {
    return Math.ceil(this.capacity() / GRID_COLS);
  }

  private stageWidth(): number {
    return GRID_X * 2 + GRID_COLS * CELL;
  }

  private stageHeight(): number {
    return GRID_Y + this.maxRows() * CELL + GRID_X;
  }

  private cellExists(col: number, row: number): boolean {
    if (col < 0 || col >= GRID_COLS || row < 0) {
      return false;
    }
    return row * GRID_COLS + col < this.capacity();
  }

  private occupantAt(
    col: number,
    row: number,
    ignoreUid?: string
  ): InventoryItem | null {
    for (const item of this.items()) {
      if (item.uid === ignoreUid) {
        continue;
      }
      if (
        col >= item.col &&
        col < item.col + item.w &&
        row >= item.row &&
        row < item.row + item.h
      ) {
        return item;
      }
    }
    return null;
  }

  private canPlace(
    col: number,
    row: number,
    w: number,
    h: number,
    ignoreUid?: string
  ): boolean {
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        if (!this.cellExists(c, r)) {
          return false;
        }
        if (this.occupantAt(c, r, ignoreUid)) {
          return false;
        }
      }
    }
    return true;
  }

  private findFreeSpot(
    w: number,
    h: number,
    ignoreUid?: string
  ): { col: number; row: number } | null {
    for (let row = 0; row < this.maxRows(); row++) {
      for (let col = 0; col <= GRID_COLS - w; col++) {
        if (this.canPlace(col, row, w, h, ignoreUid)) {
          return { col, row };
        }
      }
    }
    return null;
  }

  weaponsInShop(): ShopWeapon[] {
    return this.weapons.filter((w) => !this.ownedWeaponIds().includes(w.id));
  }

  private spaceForWeapon(weapon: ShopWeapon): boolean {
    return this.findFreeSpot(weapon.w, weapon.h) !== null;
  }

  private spaceForAmmo(ammo: ShopAmmo): boolean {
    const hasStack = this.items().some(
      (i) => i.kind === 'ammo' && i.productId === ammo.id
    );
    return hasStack || this.findFreeSpot(1, 1) !== null;
  }

  canBuyWeapon(weapon: ShopWeapon): boolean {
    return this.money() >= weapon.price && this.spaceForWeapon(weapon);
  }

  canBuyAmmo(ammo: ShopAmmo): boolean {
    return this.money() >= ammo.price && this.spaceForAmmo(ammo);
  }

  weaponTooltip(weapon: ShopWeapon): string {
    if (this.money() < weapon.price) {
      return `Még ${weapon.price - this.money()} egységnyi pénz hiányzik.`;
    }
    if (!this.spaceForWeapon(weapon)) {
      return 'Nincs elég hely az eszköztárban.';
    }
    return '';
  }

  ammoTooltip(ammo: ShopAmmo): string {
    if (this.money() < ammo.price) {
      return `Még ${ammo.price - this.money()} egységnyi pénz hiányzik.`;
    }
    if (!this.spaceForAmmo(ammo)) {
      return 'Nincs elég hely az eszköztárban.';
    }
    return '';
  }

  expansionTooltip(): string {
    if (this.expansionsBought() >= MAX_EXPANSIONS) {
      return 'Az eszköztár már nem bővíthető tovább.';
    }
    if (this.money() < EXPANSION_PRICE) {
      return `Még ${EXPANSION_PRICE - this.money()} egységnyi pénz hiányzik.`;
    }
    return '';
  }

  canBuyExpansion(): boolean {
    return (
      this.expansionsBought() < MAX_EXPANSIONS &&
      this.money() >= EXPANSION_PRICE
    );
  }

  buyWeapon(weapon: ShopWeapon): void {
    if (this.money() < weapon.price) {
      return;
    }
    const spot = this.findFreeSpot(weapon.w, weapon.h);
    if (!spot) {
      this.message.error('Nincs elég hely az eszköztárban a fegyverhez.');
      return;
    }
    const item: InventoryItem = {
      uid: this.uid(),
      kind: 'weapon',
      productId: weapon.id,
      name: weapon.name,
      col: spot.col,
      row: spot.row,
      w: weapon.w,
      h: weapon.h,
      color: weapon.color,
    };
    this.items.update((list) => [...list, item]);
    this.ownedWeaponIds.update((list) => [...list, weapon.id]);
    this.money.update((m) => m - weapon.price);
    this.redraw();
  }

  buyAmmo(ammo: ShopAmmo): void {
    if (this.money() < ammo.price) {
      return;
    }
    const existing = this.items().find(
      (i) => i.kind === 'ammo' && i.productId === ammo.id
    );
    if (existing) {
      this.items.update((list) =>
        list.map((i) =>
          i.uid === existing.uid ? { ...i, count: (i.count ?? 1) + 1 } : i
        )
      );
      this.money.update((m) => m - ammo.price);
      this.redraw();
      return;
    }
    const spot = this.findFreeSpot(1, 1);
    if (!spot) {
      this.message.error('Nincs elég hely az eszköztárban a tölténynek.');
      return;
    }
    const item: InventoryItem = {
      uid: this.uid(),
      kind: 'ammo',
      productId: ammo.id,
      name: ammo.name,
      col: spot.col,
      row: spot.row,
      w: 1,
      h: 1,
      color: ammo.color,
      count: 1,
    };
    this.items.update((list) => [...list, item]);
    this.money.update((m) => m - ammo.price);
    this.redraw();
  }

  buyExpansion(): void {
    if (!this.canBuyExpansion()) {
      return;
    }
    this.expansionsBought.update((e) => e + 1);
    this.money.update((m) => m - EXPANSION_PRICE);
    this.redraw();
  }

  hasSelection(): boolean {
    return this.selectedUid() !== null;
  }

  dropSelected(): void {
    const uid = this.selectedUid();
    if (!uid) {
      return;
    }
    const item = this.items().find((i) => i.uid === uid);
    this.items.update((list) => list.filter((i) => i.uid !== uid));
    if (item?.kind === 'weapon') {
      this.ownedWeaponIds.update((list) =>
        list.filter((id) => id !== item.productId)
      );
    }
    this.selectedUid.set(null);
    this.redraw();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    const uid = this.selectedUid();
    if (!uid) {
      return;
    }
    const deltas: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const delta = deltas[event.key];
    if (!delta) {
      return;
    }
    event.preventDefault();
    const item = this.items().find((i) => i.uid === uid);
    if (!item) {
      return;
    }
    const newCol = item.col + delta[0];
    const newRow = item.row + delta[1];
    if (this.canPlace(newCol, newRow, item.w, item.h, uid)) {
      this.items.update((list) =>
        list.map((i) => (i.uid === uid ? { ...i, col: newCol, row: newRow } : i))
      );
      this.redraw();
    }
  }

  private redraw(): void {
    if (!this.stage || !this.gridLayer || !this.itemsLayer) {
      return;
    }
    this.stage.width(this.stageWidth());
    this.stage.height(this.stageHeight());

    this.gridLayer.destroyChildren();
    this.drawMoney();
    this.drawGrid();
    this.gridLayer.draw();

    this.itemsLayer.destroyChildren();
    this.drawItems();
    this.itemsLayer.draw();
  }

  private drawMoney(): void {
    const layer = this.gridLayer!;
    layer.add(
      new Konva.Text({
        x: GRID_X,
        y: 18,
        text: `Pénz: ${this.money()}`,
        fontSize: 20,
        fontStyle: 'bold',
        fill: '#333',
      })
    );

    const btn = new Konva.Group({ x: GRID_X + 140, y: 12 });
    btn.add(
      new Konva.Rect({
        width: 64,
        height: 32,
        fill: '#1677ff',
        cornerRadius: 6,
      })
    );
    btn.add(
      new Konva.Text({
        width: 64,
        height: 32,
        text: '+100',
        align: 'center',
        verticalAlign: 'middle',
        fill: '#fff',
        fontSize: 16,
      })
    );
    btn.on('mouseenter', () => (this.stage!.container().style.cursor = 'pointer'));
    btn.on('mouseleave', () => (this.stage!.container().style.cursor = 'default'));
    btn.on('click tap', () => {
      this.money.update((m) => m + MONEY_STEP);
      this.redraw();
    });
    layer.add(btn);
  }

  private drawGrid(): void {
    const layer = this.gridLayer!;
    const cap = this.capacity();
    for (let idx = 0; idx < cap; idx++) {
      const col = idx % GRID_COLS;
      const row = Math.floor(idx / GRID_COLS);
      layer.add(
        new Konva.Rect({
          x: GRID_X + col * CELL,
          y: GRID_Y + row * CELL,
          width: CELL,
          height: CELL,
          stroke: '#999',
          strokeWidth: 1,
          fill: '#f5f5f5',
        })
      );
    }
  }

  private drawItems(): void {
    const layer = this.itemsLayer!;
    for (const item of this.items()) {
      const group = new Konva.Group({
        x: GRID_X + item.col * CELL,
        y: GRID_Y + item.row * CELL,
        draggable: true,
      });

      const selected = this.selectedUid() === item.uid;

      group.add(
        new Konva.Rect({
          width: item.w * CELL,
          height: item.h * CELL,
          fill: item.color,
          cornerRadius: 6,
          stroke: selected ? '#ff4d4f' : '#333',
          strokeWidth: selected ? 4 : 1,
        })
      );
      group.add(
        new Konva.Text({
          width: item.w * CELL,
          height: item.h * CELL,
          text: item.name,
          align: 'center',
          verticalAlign: 'middle',
          fill: '#fff',
          fontSize: 13,
          padding: 4,
        })
      );

      if (item.kind === 'ammo' && (item.count ?? 0) > 0) {
        group.add(
          new Konva.Text({
            x: item.w * CELL - 20,
            y: item.h * CELL - 18,
            text: `${item.count}`,
            fontSize: 14,
            fontStyle: 'bold',
            fill: '#fff',
          })
        );
      }

      group.on('mouseenter', () => (this.stage!.container().style.cursor = 'move'));
      group.on('mouseleave', () => (this.stage!.container().style.cursor = 'default'));

      group.on('click tap', () => {
        this.selectedUid.set(selected ? null : item.uid);
        this.redraw();
      });

      group.on('dragend', () => {
        const col = Math.round((group.x() - GRID_X) / CELL);
        const row = Math.round((group.y() - GRID_Y) / CELL);
        if (this.canPlace(col, row, item.w, item.h, item.uid)) {
          this.items.update((list) =>
            list.map((i) => (i.uid === item.uid ? { ...i, col, row } : i))
          );
        } else {
          this.message.error('Ide nem helyezhető a tárgy.');
        }
        this.redraw();
      });

      layer.add(group);
    }
  }

  private uid(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
