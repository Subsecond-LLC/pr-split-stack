import React, { useState } from 'react';
import { File } from 'parse-diff';
import styled from 'styled-components';
import DiffChunk from './DiffChunk';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 16px;
  margin-bottom: 24px;
  border: 1px solid #eee;
  border-radius: 6px;
  background-color: #fff;
`;

const Header = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div``;

const Body = styled.div``;

const ToggleAllButton = styled.button`
  font-size: 20px;
  height: 32px;
`;

function DiffFile({
  file,
  areChunksSplit,
  onToggleChunk,
  onToggleAllChunks,
}: {
  file: File;
  areChunksSplit: boolean[];
  onToggleChunk: (chunkIndex: number) => void;
  onToggleAllChunks: (value: boolean) => void;
}) {
  const allChunksToggled = areChunksSplit.every((split) => split);

  return (
    <Container>
      <Header>
        <Title>
          {file.from === file.to ? file.to : `${file.from} → ${file.to}`}
        </Title>
        <ToggleAllButton onClick={() => onToggleAllChunks(!allChunksToggled)}>
          {allChunksToggled ? '←' : '→'}
        </ToggleAllButton>
      </Header>
      <Body>
        {file.chunks.map((chunk, i) => (
          <DiffChunk
            chunk={chunk}
            isSplit={areChunksSplit[i]}
            onToggleSplit={() => onToggleChunk(i)}
          />
        ))}
      </Body>
    </Container>
  );
}

export default DiffFile;
