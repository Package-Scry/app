// eslint-disable-next-line
module.exports = {
  purge: { enabled: false, content: ["./src/index.html", "./dist/**/*"] },
  theme: {
    extend: {
      boxShadow: {
        inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.25)",
        "inner-2": "inset 0 5px 10px 0 rgba(0, 0, 0, 0.20)",
        drop: "0 0 4px 0 rgba(0, 0, 0, 0.5)",
        DEFAULT: "0 4px 10px 0 rgba(0, 0, 0, 0.4)",
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
          11: "#718990",
          12: "#8AA6AF",
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
          2: "#303740",
          3: "#231E1B",
          4: "#363E48",
          5: "#23282E",
          6: "#424B56",
        },
        blue: {
          4: "#E2FAFF",
        },
      },
      fontFamily: {
        serif: ["Bitter", "serif"],
        "sans-serif": ["Nunito", "sans-serif"],
      },
      gridTemplateColumns: {
        table: "repeat(5, minmax(0, 1fr)) 12rem",
        button: "auto 1fr",
        feature: "1rem auto",
      },
      width: {
        112: "28rem",
        160: "40rem",
      },
    },
  },
  variants: {
    extend: {
      fontSize: ["hover"],
      margin: ["first"],
    },
  },
}
