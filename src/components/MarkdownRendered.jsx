import ReactMarkdown from "react-markdown";
import Typewriter from "./Typewriter";

const MarkdownRenderer = ({ content }) => {
  const renderers = {
    paragraph: ({ children }) => {
      // Check if the only child is a Typewriter component
      if (children.length === 1 && children[0].type === Typewriter) {
        return <>{children}</>;
      }
      return <p>{children}</p>;
    },
    text: ({ value }) => <Typewriter text={value} />,
  };

  return <ReactMarkdown components={renderers}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
