export type ProductKind = 'weapon' | 'ammo';

export interface ShopWeapon {
  id: string;
  name: string;
  w: number;
  h: number;
  price: number;
  color: string;
  ammoId: string;
}

export interface ShopAmmo {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface InventoryItem {
  uid: string;
  kind: ProductKind;
  productId: string;
  name: string;
  col: number;
  row: number;
  w: number;
  h: number;
  color: string;
  count?: number;
}

export const SHOP_WEAPONS: ShopWeapon[] = [
  { id: 'w1', name: 'Kézipisztoly', w: 2, h: 1, price: 300, color: '#4a90d9', ammoId: 'a1' },
  { id: 'w2', name: 'Sörétes puska', w: 4, h: 1, price: 650, color: '#8b5a2b', ammoId: 'a2' },
  { id: 'w3', name: 'Gránátvető', w: 2, h: 2, price: 900, color: '#3f6f3f', ammoId: 'a3' },
];

export const SHOP_AMMO: ShopAmmo[] = [
  { id: 'a1', name: 'Pisztolytöltény', price: 50, color: '#d9a441' },
  { id: 'a2', name: 'Sörétes lőszer', price: 80, color: '#b5651d' },
  { id: 'a3', name: 'Gránát', price: 120, color: '#6b8e23' },
];
