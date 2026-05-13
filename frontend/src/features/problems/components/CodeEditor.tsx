import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface Props {
  code: string;
  language: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<Props> = ({ code, language, onChange }) => {
  const getLanguageExtension = () => {
    switch (language) {
      case 'javascript': return [javascript()];
      case 'python': return [python()];
      case 'cpp':
      case 'c': return [cpp()];
      case 'java': return [java()];
      default: return [javascript()];
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CodeMirror
        value={code}
        height="100%"
        theme={vscodeDark}
        extensions={getLanguageExtension()}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          highlightActiveLine: true,
          bracketMatching: true,
          autocompletion: true,
        }}
        style={{ flex: 1, fontSize: '14px', fontFamily: 'var(--font-mono)' }}
      />
    </div>
  );
};
