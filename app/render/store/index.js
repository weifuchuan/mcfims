import {
  observable
} from "mobx";
import {
  ipcRenderer
} from "electron";
import {
  GET_CLASSES,
  GET_CLASSES_RETURN
} from "../../common/channel";

const store = observable({
  classes: [],
  tables: [],
  specificTables: [],
  specificTableFiles:[],
  goTableState: {
    forceUpdateTableComponent: false,
    shouldVisitTable: ""
  },
  selectedSearch: false,
  get otherTables() {
    const set = new Set();
    this.classes.forEach(c => {
      c.tables.forEach(t => {
        set.add(t);
      });
    });
    return this.tables.filter(t => !set.has(t));
  },
  get tableToClass() {
    const map = new Map();
    this.classes.forEach(c => {
      c.tables.forEach(t => {
        map.set(t, c);
      });
    });
    return map;
  }
});

ipcRenderer.send(GET_CLASSES);
ipcRenderer.on(GET_CLASSES_RETURN, (event, {
  classes,
  tables,
  specificTables,
  specificTableFiles,
}) => {
  store.classes.clear();
  store.classes.push(...classes.map(c => observable(c)));
  store.tables.clear();
  store.tables.push(...tables);
  store.specificTables.clear();
  store.specificTables.push(...specificTables);
  store.specificTableFiles.clear();
  store.specificTableFiles.push(...specificTableFiles);
});

window.store = store;
