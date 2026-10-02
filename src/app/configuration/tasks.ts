export const tasks: {
  A: {
    imageUrl: string;
    story: string;
    subTasks: { text: string; xp: number }[];
    title: string;
  };
  B: {
    imageUrl: string;
    story: string;
    subTasks: { text: string; xp: number }[];
    title: string;
  };
  preview?: {
    imageUrl: string;
    text: string;
  };
}[] = [
  {
    A: {
      imageUrl: 'assets/images/tasks/1/A/fallout.jpg',
      story: `Ebben a feladatban egy küldetésvezérlő rendszert kell készítened.
Az alkalmazásban küldetéseket és személyzetet lehet létrehozni, a kettőt összerendelni, valamint a küldetések állapotát kezelni.`,
      subTasks: [
        {
          text: `Hozz létre **TypeScript interfészek**et a küldetésekhez és a személyzet tagjaihoz.

A személyzet adatai:
- azonosító (generált)
- név (string)
- kép (string, base64 formátumban kerül majd letárolásra)

Egy küldetés a következő adatokat tartalmazza:
- azonosító (generált)
- név (string)
- leírás (string)
- nehézség (enum: könnyű, normál, nehéz)
- státusz (enum: nyitott, folyamatban, befejezett, sikertelen)
- szükséges létszám (number)
- hozzárendelt személyzet (azonosító tömb)`,
          xp: 2,
        },
        {
          text: `A felületet bontsd két, egymás melletti panelre. A bal oldali panelben lehessen **választani a feladat fő funkciói közül**:
- Személyzetkezelő
- Küldetés létrehozása
- Küldetések kiosztása
- Küldetésvezérlő

A választás módjának megoldása tetszőleges (pl.: gombok, egy szelektor, stb.).

A fő funkciókat majd külön komponensekben implementáld.
A kiválasztott funkció a jobb oldali panelben jelenjen meg.
          
A felület felosztásához használd az _ng-zorro_ splitter komponensét: https://ng.ant.design/components/splitter/en`,
          xp: 2,
        },
        {
          text: `Először implementáld a **Személyzetkezelő** funkciót.
          
Egy űrlap segítségével legyen lehetőség felvenni új személyeket.
Az űrlap két mezőből álljon:
- Név (string típus)
Kapcsolódó validációk: Kötelező, minimum 5, maximum 16 karakter, a név 2 és 4 közötti szóból álljon.
- Kép (string típus - base64)
Képfeltöltéshez használd az _ngx-image-cropper_ (https://www.npmjs.com/package/ngx-image-cropper) csomagot.
A kép feltöltése opcionális, viszont ha meg van adva, akkor a kép felbontása legalább 32x32 pixel, legfeljebb 1024x1024 pixel legyen.

Mentéskor a személyzet adatait localStorage-ben tárold, beleértve a feltöltött képeket is.
Mivel localStorage-ben domainenként csak 5MB tárolható a legtöbb böngésző esetében, érdemes kisebb képekkel tesztelni.`,
          xp: 5,
        },
        {
          text: `Az űrlap felett egy listában (https://ng.ant.design/components/list/en) jelenjenek meg a **személyzet eddig felvett tagjai**.
A listában a személyhez tartozó kép is jelenjen meg.
Amennyiben nem lett kép megadva a személyhez, egy tetszőleges placeholder képet jeleníts meg.`,
          xp: 3,
        },
        {
          text: `Listaelemenként jelenjen meg két ikon vagy gomb, amellyel a **személyzet tagjai módosíthatók, valamint törölhetők.**.`,
          xp: 2,
        },
        {
          text: `Következzen a **Küldetés létrehozása** funkció implementálása.
Először készíts űrlapot reactive form használatával.

Az űrlap tartalmazza a következő mezőket:
- név (string)
- leírás (string)
- nehézség (enum, értékkészlete: "könnyű", "normál", "nehéz". Használj tetszőleges választót, mint select vagy radiobutton.)
- szükséges létszám (szám, használd az InputNumber komponenst: https://ng.ant.design/components/input-number/en)

Létrehozáskor a küldetések "Nyitott" státuszban jöjjenek létre.

Az űrlap a következő validációkat alkalmazza:
- A leírást leszámítva minden mező megadása kötelező.
- A létszám értéke minimum 1, maximum 3.
- Ha a nehézség "nehéz", akkor a szükséges létszám értéke minimum 2 legyen, egyéb esetben 1 ember elegendő.

Mentéskor a küldetéseket cookie-ban tárold.
Használható például az _ngx-cookie-service_ (https://www.npmjs.com/package/ngx-cookie-service) csomag.`,
          xp: 5,
        },
        {
          text: `A **Küldetések kiosztása** funkció alatt a felvett küldetések egy fában (https://ng.ant.design/components/tree/en) jelenjenek meg.

A fa legmagasabb szintű csomópontjai a státuszok legyenek:
- Nyitott
- Folyamatban
- Befejezett
- Sikertelen

Ezek alatt jelenjenek meg a küldetések nevei, mint a fa levelei.

A küldetések státusz szerinti szűrését Angular Pipe-pal (https://angular.dev/api/core/Pipe) implementáld.
Az elsődleges bemeneti paramétere legyen a küldetéslista, a második paraméter pedig egy státusz értéke (Nyitott, Folyamatban, Befejezett, Sikertelen).
A pipe eredménye legyen a státusz szerint leszűrt küldetéslista.`,
          xp: 4,
        },
        {
          text: `A fa valamely levelére (egy küldetésre) kattintva jelenjenek meg a **küldetés adatai egy felugró modális ablakban** (https://ng.ant.design/components/modal/en).`,
          xp: 1,
        },
        {
          text: `A modalban lehessen **személyzetet rendelni az adott küldetéshez**.
Pontosan annyi személy hozzárendelését engedje a felület, amennyi a küldetés szükséges létszámaként meg lett adva.
Egy személy tartozhat egyszerre több küldetéshez is, ezzel nem szükséges külön foglalkozni.`,
          xp: 2,
        },
        {
          text: `A **Küldetésvezérlő** menü alatti felületen lehessen változtatni a küldetések státuszát.
          
Ez egy drag&drop-os felületen keresztül történjen, ahol státuszonként van egy dropzone (oszlop).
Hasonlóra kell gondolni, mint a projektmenedzsment szoftverek Kanban táblája, ahol státuszonként vannak feladatok és a felhasználó tudja ezeket mozgatni státuszok között.

A drag&drop megvalósítására használható például a CDK ide kapcsolódó funkciója: https://angular.dev/guide/drag-drop.

Ha a felhasználó egy küldetést másik státuszba mozgat, a változás azonnal frissüljön a cookie-ban is.`,
          xp: 4,
        },
        {
          text: `A **státuszváltásra a következő szabályok vonatkoznak**:
- Azok a küldetések, amelyeknél nincs meg a megfelelő létszám (Küldetések kiosztása funkció alatt végrehajtott hozzárendelések alapján) egyáltalán nem mozgathatóak.
- A státuszok között csak előre lehessen haladni, visszafelé nem (tehát egy elkezdett küldetés nem mozgatható vissza "Nyitott" státuszba).
- Egyszerre csak egy lépést haladhassunk előre, tehát "Nyitott"-ból átmozgatható "Folyamatban"-ra, de "Befejezett"-be vagy "Sikertelen"-be nem.
- "Folyamatban" levő küldetés mozgatható "Befejezett"-be és "Sikertelen"-be is.

Tiltott művelet esetén egy _ng-zorro_ message (https://ng.ant.design/components/message/en)
vagy notification (https://ng.ant.design/components/notification/en) jelenjen meg, ami a probléma okát jelzi a felhasználónak.`,
          xp: 4,
        },
        {
          text: `Külön bejelentkezési felületet nem szükséges fejleszteni, helyette a bal oldali panelben a funkcióválasztó
felett legyen lehetőség kiválasztani, hogy **kinek a szemszögéből nézzük éppen a felületet**.

Két szerepkört kezeljen a program:
- Admin
- Személyzet

A két szerepkör között két tetszőleges ikonnal ellátott avatar (https://ng.ant.design/components/avatar/en) segítségével lehessen választani.
Vizuálisan látsszon, hogy a kettőből melyik van éppen kiválasztva.

A "Személyzet" opció választása esetén kelljen választani egyet az előző lépésben felvett személyzetből.
Az admin szerepkör esetén felhasználószintű megkülönböztetésre nincs szükség, mivel ezek nem is léteznek.

A választás hatása a felület más részeire a következő két feladatban kerül majd implementálásra.`,
          xp: 2,
        },
        {
          text: `Készíts **Angular direktívát** (https://angular.dev/api/core/Directive), amely a felhasználó jogosultsági szintje (Admin vagy Személyzet) alapján elrejthet funkciókat.

A működése valahogy így nézne ki például:

\`\`\`html
<button *appHasRole="'Admin'">Küldetés létrehozása</button>
\`\`\`

Ha Admin szerepkörrel használjuk a felületet, akkor a fenti gomb jelenjen meg, egyébként ne.

Adminisztrátorok minden funkciót láthatnak.
A személyzet számára ne jelenjenek meg a következő funkciók:
- Személyzetkezelő
- Küldetés létrehozása
- Küldetések kiosztása`,
          xp: 2,
        },
        {
          text: `A **Küldetésvezérlő személyzeti szerepkör esetén** csökkentett funkcionalitással jelenjen meg.
- Az ő szerepkörük esetén ne legyen lehetőség státuszváltásra (legyen kikapcsolva a drag&drop).
- Ezen felül ne jelenjen meg számukra minden küldetés, csak amihez hozzá vannak rendelve.`,
          xp: 2,
        },
      ],
      title: `Quest Log`,
    },
    B: {
      imageUrl: 'assets/images/tasks/1/B/resident_eeeevil.png',
      story:
        'Készítsd el a Resident Evil játékokból ismert inventory (eszköztár) rendszer egyszerűsített változatát Konvával és Angularban.',
      subTasks: [
        {
          text: `A felület bal oldalán jelenjen meg egy 4x2-as rács, ami a játékos inventoryját fogja reprezentálni.
A rácsot Konva felületen rajzold ki.

![Inventory](/assets/images/tasks/1/B/inventory_small.png)`,
          xp: 2,
        },
        {
          text: `Szintén a Konva felületen, jelenjen meg egy elem, ami a **pénzkészletet** jelöli. 
A kezdeti értéke legyen 1000.`,
          xp: 1,
        },
        {
          text: `A pénzkészlet mellett, továbbra is a Konva felületen, jelenjen meg egy gombszerű elem.
Erre kattintva a **pénzkészlet kattintásonként 100-zal növekedjen**.`,
          xp: 2,
        },
        {
          text: `A Konva felület alatt vagy mellett jelenjen meg a **bolt**.
Ezt Angularban implementáld, DOM-ban, tehát ne a Canvas része legyen!

Először helyezz el egy három fület tartalmazó fülsort az _ng-zorro_ Tabs (https://ng.ant.design/components/tabs) komponensével.
A három tab neve legyen:
- Fegyverek
- Töltény
- Fejlesztések`,
          xp: 1,
        },
        {
          text: `A fegyverek alatt legyen legalább három **termék**.
Nyugodtan választhatsz gyerekbarát eszközöket is, ha az szimpatikusabb (pl.: csúzli, vízipisztoly, ...).
A lehetőségek rád vannak bízva, de minden lehetőség kapjon egy nevet, egy méretet és egy árat.
A méret fogja meghatározni, hogy az adott fegyver mekkora helyet foglal az inventoryban.
Olyan méretet válassz, ami tényleg el is fog férni az inventoryban (pl.: 2x1, 4x1, 2x2).
Például egy 5x3-as méretű fegyver a korábban meghatározott rácsméretben soha nem férne el.

A töltények menüpontban lehessen töltényt venni a fegyverekhez (minden fegyvertípushoz egy tölténytípus).
A név és az ár itt is releváns, viszont a méret legyen fixen 1x1.

A fejlesztések menüpontban első körben egy lehetőség jelenjen meg az inventory bővítésére.
Az opció jelezze, hogy megvásárlás esetén 2 négyzettel fogja bővíteni az eszköztárat.`,
          xp: 3,
        },
        {
          text: `Minden boltban található termék esetén legyen lehetőség **megvásárolni** azt egy gomb segítségével.
A gomb csak akkor legyen aktív, ha a játékosnak van elég pénze megvásárolni a terméket,
egyéb esetben a gomb felé mozgatva az egeret egy tooltip vagy popover jelezze, hogy mennyi pénz hiányzik még a megvételéhez.`,
          xp: 2,
        },
        {
          text: `Először a **fegyver megvételé**t implementáld.
Minden fegyver egészen pontosan egyszer legyen megvásárolható, ha azt a játékos már megvásárolta, akkor az opció már ne jelenjen meg a boltban.

A fegyver megvásárlása esetén a következők történjenek:
- A fegyver ára kerüljön levonásra a játékos pénzéből.
- A megvétel lehetősége kerüljön ki a boltból.
- A fegyver kerüljön be a játékos Konvával implementált eszköztárába.

Az utolsó ponthoz szükséges lesz készíteni egy komplex Konva objektumot és azt elhelyezni (célszerű a Konva Group típusát használni).
Ez történhet hasonlóan, mint, ahogy az órai projektben a "House" és a "Car" objektumokat létrehoztuk.
Ebben a feladatban még oké, ha az eszköztár bal felső sarkába helyeződik fixen, a pozícionálással majd a következő feladat foglalkozik.
Fontos viszont, hogy a megadott méretben jelenjen meg az objektum, azaz ha például a méret 4x1-es,
akkor hosszban négy helyet (négyzetet) foglaljon el a rácsban (grid-ben) magasságban pedig 1-et.
A rajzokat érdemes a kitalált méretnek megfelelően létrehozni, hogy ne torzuljanak.`,
          xp: 6,
        },
        {
          text: `Vásárlás során a megvásárolt fegyver automatikusan olyan pozícióba kerüljön lehelyezésre, ahol valóban **elfér**.
Ha a korábbi vásárlások miatt már nincsen számára hely, akkor blokkoljuk a megvásárlását és egy
tooltip vagy popover jelezze ezt a játékos számára.

Fontos, hogy két tárgy soha nem foglalhatja el ugyanazt a négyzetet.`,
          xp: 4,
        },
        {
          text: `Fegyverek mellett legyen lehetőség **töltényeket is vásárolni**.
A lehelyezési szabály hasonlóan működjön, mint az előző esetben, tehát ha teljesen betelt az eszköztár
akkor ne legyen lehetőség a megvásárlására
(ha még az adott töltényből nincs az inventoryban akkor egy szabad rácsmező szükséges).

A töltény annyiban működjön máshogy, mint a fegyver, hogy ebből többet is tud vásárolni a játékos.

Az eszköztárba ezek ne egyesével kerüljenek be, hanem egy kupacba rendeződjenek (stackeljenek).
Ha az adott tölténytípusból már van legalább egy darab az inventoryban, újabb vásárláskor ne kerüljön be új tárgy, csak a meglévő stack darabszáma növekedjen.
Ha még nincs ilyen töltény az inventoryban, akkor a vásárláshoz szükséges egy szabad 1x1-es hely.

A tárgy jobb alsó sarkában jelezze egy szám, hogy az adott tölténytípusból mennyi van a játékosnál.`,
          xp: 4,
        },
        {
          text: `A játékos tudja mozgatni az inventoryban szereplő tárgyakat a rácson belül **drag&drop** használatával.
Fontos, hogy a tárgyak elengedéskor (drop) illeszkedjenek a rácshoz (snap): a tárgy bal felső sarka a legközelebbi rácsmező bal felső sarkához igazodjon.
 
 Ha a játékos olyan helyen engedi el (dropolja) az elemet, ahol a tárgy nem férne el, akkor a tárgy térjen vissza az eredeti
 pozíciójára és jelenjen meg egy üzenet, amely jelzi a hibát.
 Erre használható például a _ng-zorro_ message komponense: https://ng.ant.design/components/message/en`,
          xp: 4,
        },
        {
          text: `Kattintásra tárgyak legyenek **kiválasztható**ak. Ilyenkor a tárgy kapjon egy keretet.
Újbóli kattintásra távolítsuk el a kiválasztást.
Egyszerre csak egy tárgy lehet kiválasztva, tehát ha egy másik tárgyra kattintunk akkor kerüljön át oda a kiválasztás.`,
          xp: 2,
        },
        {
          text: `Amikor van kiválasztva tárgy, akkor a felületen valahol jelenjen meg egy gomb ami a **tárgy eldobásá**ra szolgál.
Ezt a gombot használva törlődjön a tárgy az eszköztárból.
Fegyverek esetén ilyenkor váljon újra megvásárolhatóvá a tárgy.`,
          xp: 2,
        },
        {
          text: `A kiválasztott tárgyak legyenek **mozgathatóak a billentyűzet kurzorgombjaival** is.
A mozgás csak akkor érvényesüljön, ha a gombnyomás valid pozícióba mozgatja a tárgyat.

Ha nincs kiválasztva tárgy, akkor a kurzorbillentyűknek nem szükséges funkciót adni.

Például, ha van egy 4x1-es tárgyunk a 4x2-es rácsban akkor azt horizontálisan biztosan nem fogjuk tudni mozgatni,
vertikálisan a fel és le gombokkal viszont elképzelhető, hogy igen, hacsak nem blokkolja ezt más tárgy.`,
          xp: 3,
        },
        {
          text: `A bolt fejlesztések füle alatt egyetlen termék található: az **eszköztár bővítése**.
          
Ez legyen négy alkalommal bővíthető.
Minden vásárlás 2 új négyzettel bővítse az eszköztárat, a 4-es szélesség megtartásával
(az inventory mélységét bővítjük, nem a szélességét).

Tehát ha 4x2-es négyzetrácsból indulunk, akkor az első vásárlás után a harmadik sorban két új mező jelenik meg.
A második vásárlás után már három darab 4 elemes sorunk lesz.`,
          xp: 4,
        },
      ],
      title: `Inventory management`,
    },
    preview: undefined,
  },
  {
    A: {
      imageUrl: 'assets/images/tasks/2/A/logs.jpg',
      story: 'Naplófájlok elemzése Web Workeren.',
      subTasks: [
        {
          text: `A projekt "assets/logs" mappájában található **JSON fájlokat olvasd fel** a _HttpClient_ segítségével.
Az összes beolvasott naplóbejegyzést egyetlen közös tömbben tárold. Tehát ne fájlonként legyen egy tömb.
Az, hogy melyik fájlból lett beolvasva egy bejegyzés, nem számít.

A naplóbejegyzések tartalma fájltól függetlenül megegyezik.
A naplóbejegyzések tartalmaznak időpontot, típust, súlyosságot, felhasználót, valamint üzenetet.
Hozz létre hozzá TypeScript interfészt.`,
          xp: 1,
        },
        {
          text: `**Jelenítsd meg a naplóbejegyzéseket** az _ng-zorro_ _nz-table_ komponensével: https://ng.ant.design/components/table/en.
          
Aktiváld a Virtual Scroll funkciót, hogy nagy elemszám esetén se romoljon a megjelenítés teljesítménye.
A Virtual Scroll használatára találhatsz példát az előbb említett linken.`,
          xp: 1,
        },
        {
          text: `Implementálj **szűrési lehetőséget** súlyosság, felhasználó és dátumtartomány alapján.`,
          xp: 1,
        },
        {
          text: `A szűrő űrlap tartalmazzon egy **extra validátor**t: a kezdődátum nem lehet későbbi, mint a végdátum.`,
          xp: 1,
        },
        {
          text: `Integráld a projektedbe __workers_ mappában található _log.worker.ts_ **Web Worker**t az órai példa alapján,
          és valósítsd meg a **kommunikáció**t a fő szál (Angular komponens) és a worker között.

A worker és a fő szál tudjon üzeneteken keresztül kommunikálni, az ehhez szükséges feliratkozásokat készítsd el.`,
          xp: 1,
        },
        {
          text: `**Küldd át** az aktuális szűrésnek megfelelő naplóbejegyzéslistát a Web Workernek.
A lista változásra reagálva frissüljön, amikor a szűrési feltételek változnak.

A worker oldalon a fogadott naplóbejegyzéseket tárold el egy tömbben.`,
          xp: 1,
        },
        {
          text: `A worker az aktuális szűrőfeltételeknek megfelelően számolja ki a következő **statisztikák**at:
- bejegyzések száma
- hibák száma (severity: error)
- figyelmeztetések száma (severity: warning)
- legtöbbször előforduló felhasználó
- naponkénti eloszlás

A worker minden esetben az aktuális szűrőfeltételeknek megfelelő naplóbejegyzéseken végezze a számításokat.

Az eredményeket elkészültük után juttasd vissza a fő szálra.
A fő szál ezt az eredményt fogadja és kártyák használatával jelenítsd is meg az aktuális statisztikákat: https://ng.ant.design/components/card/en

A statisztikák kiszámítása kizárólag a Web Workerben történjen, a fő szálon nem végezhető ilyen számítás.`,
          xp: 2,
        },
        {
          text: `Egy tetszőlegesen választott és integrált charting library segítségével készíts egy egyszerű **oszlopdiagram**ot a naponkénti bejegyzéseloszlásból.
          
A diagram automatikusan frissüljön a statisztikák változásának megfelelően.`,
          xp: 2,
        },
      ],
      title: `Log Analyzer`,
    },
    B: {
      imageUrl: 'assets/images/tasks/2/B/2B.jpg',
      story: `Ebben a feladatban egy egyszerű szövegfájl-elemző komponenst kell készítened Angularban.

Célja, hogy a felhasználó feltölthessen egy .txt fájlt, megtekinthesse annak tartalmát, kereséseket végezzen benne,
valamint diagramon láthassa a fájlban leggyakrabban előforduló szavakat.`,
      subTasks: [
        {
          text: `Készíts **fájlfeltöltő felület**et az _ng-zorro_ Upload komponensével: https://ng.ant.design/components/upload/en.

Csak _.txt_ kiterjesztésű fájl legyen kiválasztható.
Ha a felhasználó más típusú fájlt próbál feltölteni, jelenjen meg hibaüzenet _ng-zorro_ message vagy notification használatával.

A fájl feltöltése ne szerverre történjen, hanem kliensoldalon olvasd be a fájl tartalmát.`,
          xp: 2,
        },
        {
          text: `A kiválasztott .txt fájl **tartalmá**t jelenítsd meg egy jól elkülöníthető dobozban.

A doboz legyen görgethető, ha a fájl tartalma túl hosszú.
Jelenjen meg a fájl neve és a fájl mérete is.`,
          xp: 1,
        },
        {
          text: `Készíts **keresőmező**t, amelyben a felhasználó megadhat egy keresett szót vagy kifejezést.

A keresőmező értékének változására frissüljön a kiemelés a megjelenített szövegben.
Ennek megvalósításához integrálj egy erre alkalmas külső csomagot, például a _mark.js_-t (https://www.npmjs.com/package/mark.js).
A keresőmezőben megadott szöveg összes előfordulását jelöld ki a fájl tartalmában.

Üres keresőmező esetén ne legyen kiemelés.
A keresés legyen kis- és nagybetűfüggetlen.`,
          xp: 3,
        },
        {
          text: `Dolgozd fel a fájl szövegét, és számold meg a benne előforduló szavakat.

A számolás során:
- a kis- és nagybetűs alakokat tekintsd azonosnak
- az írásjeleket (pont, vessző, stb.) ne tekintsd a szó részének
- az üres elemeket hagyd figyelmen kívül

Határozd meg a **10 leggyakrabban előforduló szót** majd írasd ki konzolra (_console.log_).`,
          xp: 1,
        },
        {
          text: `A 10 leggyakrabban előforduló szót jelenítsd meg **pie chart diagram**on egy tetszőleges
charting library használatával.

A diagram frissüljön automatikusan, amikor a felhasználó új fájlt választ ki.`,
          xp: 2,
        },
        {
          text: `Adj a komponenshez **vágólap**ra másolási funkciót.

Legyen egy gomb, amellyel a felhasználó kimásolhatja a 10 leggyakoribb szó listáját.`,
          xp: 1,
        },
      ],
      title: `Text Analyzer`,
    },
    preview: undefined,
  },
];
