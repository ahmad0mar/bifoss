import ReactMarkdown from 'react-markdown'

// Code blocks scroll sideways, so they need to be reachable with the keyboard.
const components = {
  pre: (props) => <pre tabIndex={0} {...props} />,
  img: ({ alt = '', ...props }) => <img alt={alt} loading="lazy" decoding="async" {...props} />,
}

/** Article body for blog posts and event pages: a 68-character measure, code on the terminal colour. */
export default function Markdown({ children }) {
  return (
    <div className="prose-bifoss">
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}
