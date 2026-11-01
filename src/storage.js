/*
 * Simpanan kemajuan: localStorage bila ada, memori bila tiada (mod peribadi, iframe tersekat).
 * Hanya nama panggilan, umur dan avatar disimpan; tiada emel atau nombor telefon.
 */
(function (root) {
  const KEY = 'misi3m:v1';
  let mem = null;
  const Storage = {
    available: true,
    load(blank) {
      let raw = null;
      try { raw = root.localStorage.getItem(KEY); } catch (e) { this.available = false; }
      if (!raw) return mem ? JSON.parse(JSON.stringify(mem)) : blank();
      try { return this.migrate(JSON.parse(raw), blank); } catch (e) { return blank(); }
    },
    migrate(s, blank) {
      const b = blank();
      if (!s || typeof s !== 'object' || s.v !== b.v) return Object.assign(b, s && s.profile ? { profile: s.profile } : {});
      return Object.assign(b, s, { settings: Object.assign(b.settings, s.settings || {}) });
    },
    save(store) {
      mem = store;
      try { root.localStorage.setItem(KEY, JSON.stringify(store)); this.available = true; } catch (e) { this.available = false; }
    },
    clear() {
      mem = null;
      try { root.localStorage.removeItem(KEY); } catch (e) { /* memori sahaja */ }
    },
  };
  root.Storage = Storage;
})(typeof window !== 'undefined' ? window : globalThis);
