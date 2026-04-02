export const getContent = (content) => {
  // string → direct return
  if (typeof content === "string") return content;

  // array → join text
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.text) return item.text;
        return "";
      })
      .join("");
  }

  // object → extract text
  if (typeof content === "object") {
    return content?.text || "";
  }

  return "";
};
