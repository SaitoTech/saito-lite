class Path {
  constructor(from="", to="", sig="") {
    this.from = from;
    this.to   = to;
    this.sig  = sig;

    return this;
  }
}

module.exports = Path;
