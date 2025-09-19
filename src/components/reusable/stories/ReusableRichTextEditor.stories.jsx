import React, { useState } from "react";
import ReusableRichTextEditor from "../ReusableRichTextEditor";

export default {
  title: "Reusable/ReusableRichTextEditor",
  component: ReusableRichTextEditor,
};

export const Default = () => {
  const [value, setValue] = useState("");
  return <ReusableRichTextEditor value={value} onChange={setValue} />;
};
