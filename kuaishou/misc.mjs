// 这些函数都是直接从 https://w2.kskwai.com/kos/nlav12555/js/app.2ce2c20f.js 中复制过来的
// 逆向分析过后这些函数参与了加密过程

function re() {     // 时间戳
  return new Date().getTime();
}

function ne() {     // 生成一个nonce
  const t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"
  return new Array(10)
    .fill(1)
    .map(function () {
      return t.charAt(Math.floor(Math.random() * t.length));
    })
    .join("")
}

function oe(t) {
  return "0123456789abcdefghijklmnopqrstuvwxyz".charAt(t);
}

function se(t, e) {
  switch (e) {
    case "base64":
      return t;
    case "hex":
      return (function (t) {
        var e,
          o = "",
          i = 0,
          r = 0;
        for (e = 0; e < t.length && "=" != t.charAt(e); ++e) {
          var n =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(
              t.charAt(e)
            );
          n < 0 ||
            (0 == i
              ? ((o += oe(n >> 2)), (r = 3 & n), (i = 1))
              : 1 == i
              ? ((o += oe((r << 2) | (n >> 4))), (r = 15 & n), (i = 2))
              : 2 == i
              ? ((o += oe(r)), (o += oe(n >> 2)), (r = 3 & n), (i = 3))
              : ((o += oe((r << 2) | (n >> 4))),
                (o += oe(15 & n)),
                (i = 0)));
        }
        return 1 == i && (o += oe(r << 2)), o;
      })(t);
    default:
      return e;
  }
}

export { re, ne, se }