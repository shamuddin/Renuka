// Resolves a public asset path against the app's base URL so everything works
// whether the app is served at the domain root ('/') or under a subpath like
// '/anniversary/'. Pass paths WITHOUT a leading slash, e.g. asset('models/x.glb').
export const asset = (p) => import.meta.env.BASE_URL + String(p).replace(/^\/+/, '');
