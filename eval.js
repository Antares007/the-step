function space(S, str, c) {
  S(
    function() {},
    function(x, s) {
      if (str.startsWith(x)) { c(str.slice(x.length)); }
      space(s, str, c);
    },
    function(s, t) { time(t, str, c), space(s, str, c); }
  )
};
function time(S, str, c) {
  S(
    function() { c(str); },
    function(x, t) {
      if (str.startsWith(x)) { time(t, str.slice(x.length), c); }
    },
    function(s, t) { space(s, str, function(str) { time(t, str, c); }); }
  );
};


