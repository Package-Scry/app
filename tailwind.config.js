// eslint-disable-next-line
module.exports = {
  theme: {
    extend: {
      boxShadow: {
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      colors: {
        gray: {
          DEFAULT: "gray",
          1: "#333333",
          2: "#4F4F4F",
          3: "#456F7B",
          4: "#61828D",
          5: "#828282",
          6: "#758B8E",
          7: "#BDBDBD",
          8: "#E0E0E0",
          9: "#F2F2F2",
          10: "#E3EFF0",
        },
        turquoise: {
          1: "#0C4C5A",
          2: "#306070",
          3: "#0E7698",
          4: "#21888E",
          5: "#128CB4",
        },
        black: {
          DEFAULT: "black",
          1: "#303740",
        },
        blue: {
          4: "#E2FAFF",
        },
      },
      fontFamily: {
        serif: ["Bitter", "serif"],
      },
      gridTemplateColumns: {
        table: "repeat(4, minmax(0, 1fr)) 12rem",
      },
    },
  },
}
