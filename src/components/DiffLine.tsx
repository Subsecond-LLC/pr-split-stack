import React from 'react';
import styled from 'styled-components';
import SyntaxHighlighter from 'react-syntax-highlighter';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const LineNumber = styled.div<{
  backgroundColor: string;
  multiNumber: boolean;
}>`
  font-family: monospace;
  white-space: pre;
  user-select: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  width: ${({ multiNumber }) => (multiNumber ? '90px' : '30px')};
  padding: 0 8px;
`;

function formatLineNumber(line: number) {
  return (line === -1 ? '' : line).toString().padStart(4);
}

function DiffLine({
  children,
  line,
  type,
}: {
  children: string;
  line: number | [number, number];
  type: 'normal' | 'add' | 'del' | 'empty';
}) {
  const backgroundColor =
    type === 'normal'
      ? '#f8f9fa'
      : type === 'add'
      ? '#e6ffec'
      : type === 'del'
      ? '#ffebe9'
      : '#f1f2f3';

  return (
    <Container>
      <LineNumber
        backgroundColor={backgroundColor}
        multiNumber={typeof line !== 'number'}
      >
        {typeof line !== 'number'
          ? `${formatLineNumber(line[0])}${'  '}${formatLineNumber(line[1])}`
          : formatLineNumber(line)}
      </LineNumber>
      <SyntaxHighlighter
        language="typescript"
        customStyle={{
          backgroundColor,
          margin: '0',
          padding: '0',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {children}
      </SyntaxHighlighter>
    </Container>
  );
}

export default DiffLine;
