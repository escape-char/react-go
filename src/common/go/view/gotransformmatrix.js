export default class GoTransformMatrix{
    constructor(){
        this.a = this.d = 1;
        this.b = this.c = this.e = this.f = 0;
    }
    clone() {
        let m = new GoTransformMatrix();
        m.a = this.a;
        m.b = this.b;
        m.c = this.c;
        m.d = this.d;
        m.e = this.e;
        m.f = this.f;
        return m;
    }
    reset() {
        this.setTransform(1, 0, 0, 1, 0, 0);
    }
    scale (sx, sy) {
        this.transform(sx, 0, 0, sy, 0, 0);
    }
    setTransform(a, b, c, d, e, f) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    translate(tx, ty) {
        this.transform(1, 0, 0, 1, tx, ty);
    }
    transform(a2, b2, c2, d2, e2, f2) {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const e1 = this.e;
        const f1 = this.f;

        this.a = a1 * a2 + c1 * b2;
        this.b = b1 * a2 + d1 * b2;
        this.c = a1 * c2 + c1 * d2;
        this.d = b1 * c2 + d1 * d2;
        this.e = a1 * e2 + c1 * f2 + e1;
        this.f = b1 * e2 + d1 * f2 + f1;
 
    }
    isIdentity() {
        return (this._q(this.a, 1) &&
                this._q(this.b, 0) &&
                this._q(this.c, 0) &&
                this._q(this.d, 1) &&
                this._q(this.e, 0) &&
                this._q(this.f, 0));
    }
    inverse() {
        if (this.isIdentity()) {
            return new GoTransformMatrix();
        }
        else if (!this.isInvertible()) {
            throw "Unable to invert matrix.";
            return;
        }
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const e = this.e;
        const f = this.f;

        let m = new GoTransformMatrix();
        const dt =this.determinant(a,b,c,d);
        m.a = d / dt;
        m.b = -b / dt;
        m.c = -c / dt;
        m.d = a / dt;
        m.e = (c * f - d * e) / dt;
        m.f = -(a * f - b * e) / dt;

        return m;
    }
    determinant(a,b,c,d) {
        return a * d - b * c;
    }

    isInvertible(){
        return !this._q(this.determinant(
                this.a,this.b, this.c,this.d), 0)
    }
    _q(f1, f2) {
        return Math.abs(f1 - f2) < 1e-14;
    }
    applyToPoint(x, y) {
        return {
            x: x * this.a + y * this.c + this.e,
            y: x * this.b + y * this.d + this.f
        };
    }
    applyToArray(points) {
        let matPoints = [];
        for(const p of points) {
            matPoints.push(this.applyToPoint(p.x, p.y));
        }
        return matPoints;
    }

}
