import React, { useState } from 'react';
import DiffLine from './DiffLine';
import { Chunk } from 'parse-diff';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
`;

const CodeSections = styled.div<{ reverse: boolean }>`
  display: flex;
  flex-direction: ${({ reverse }) => (reverse ? 'row-reverse' : 'row')};
  width: 100%;
`;

const CodeSection = styled.div`
  width: calc(50% - 20px);
`;

const DiffChunkTitle = styled.div`
  font-family: monospace;
  background-color: #eee;
  padding: 8px;
`;

const DiffLines = styled.div``;

const StyledButton = styled.button`
  width: 40px;
  font-size: 20px;
  cursor: pointer;
`;

function ToggleButton({
  onToggle,
  value,
}: {
  onToggle: () => void;
  value: boolean;
}) {
  return (
    <StyledButton onClick={() => onToggle()}>{value ? '←' : '	→'}</StyledButton>
  );
}

function DiffChunk({
  chunk,
  isSplit,
  onToggleSplit,
}: {
  chunk: Chunk;
  isSplit: boolean;
  onToggleSplit: () => void;
}) {
  let beforeLineNumber = chunk.oldStart;
  let afterLineNumber = chunk.newStart;
  let unchangedLineNumber = chunk.oldStart;

  return (
    <Container>
      <DiffChunkTitle>{chunk.content}</DiffChunkTitle>
      <CodeSections reverse={isSplit}>
        <CodeSection>
          <DiffLines>
            {chunk.changes.map((change, i) => (
              <DiffLine
                type={change.type}
                line={[
                  change.type === 'add' ? -1 : beforeLineNumber++,
                  change.type === 'del' ? -1 : afterLineNumber++,
                ]}
              >
                {change.content}
              </DiffLine>
            ))}
          </DiffLines>
        </CodeSection>
        <ToggleButton onToggle={() => onToggleSplit()} value={isSplit} />
        <CodeSection>
          <DiffLines>
            {chunk.changes.map((change) => (
              <DiffLine
                type={change.type === 'add' ? 'empty' : 'normal'}
                line={change.type === 'add' ? -1 : unchangedLineNumber++}
              >
                {change.type === 'add'
                  ? ' '
                  : change.type === 'del'
                  ? ' ' + change.content.slice(1)
                  : change.content}
              </DiffLine>
            ))}
          </DiffLines>
        </CodeSection>
      </CodeSections>
    </Container>
  );
}

export default DiffChunk;
