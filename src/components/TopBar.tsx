import React, { useState } from 'react';
import styled from 'styled-components';
import SplitModeToggle from './SplitModeToggle';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo300.png';

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom: 1px solid #eee;
`;

const Content = styled.div`
  height: 70px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SendButton = styled.button`
  text-transform: capitalize;
  border: 3px solid #ddd;
  font-size: 18px;
  width: 140px;
  font-weight: 500;
  padding: 8px;
  border-radius: 4px;
  float: right;

  :hover {
    background-color: #ccc;
    cursor: pointer;
  }
`;

const TextInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  width: 100%;
`;

const TextInput = styled.input`
  font-size: 18px;
  background-color: #fff;
  color: #333;
  border: none;
  width: 100%;
  outline: none;
`;

const TextInputButton = styled.button`
  cursor: pointer;
  font-family: monospace;
`;

const TopArea = styled.div<{ position: 'flex-start' | 'center' | 'flex-end' }>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ position }) => position};
  width: 33%;
`;

const Logo = styled.img`
  width: 42px;
  height: 42px;
  margin-right: 16px;
  cursor: pointer;
`;

function TopBar({
  splitMode,
  onChangeSplitMode,
  onSend,
  isSendDisabled,
  initialGithubURL,
}: {
  splitMode: 'split' | 'stack';
  onChangeSplitMode: (splitMode: 'split' | 'stack') => void;
  onSend: () => void;
  isSendDisabled: boolean;
  initialGithubURL?: string;
}) {
  const navigate = useNavigate();

  const [githubURL, setGithubURL] = useState<string>(initialGithubURL ?? '');

  return (
    <Container>
      <Content>
        <TopArea position="flex-start">
          <Logo src={logo} onClick={() => navigate('/')} />
          <TextInputContainer>
            <TextInput
              placeholder="Ex: https://github.com/torvalds/linux/pull/8"
              value={githubURL}
              onChange={(e) => setGithubURL(e.target.value)}
              onKeyDown={(e) =>
                e.code === 'Enter' &&
                navigate(`/${githubURL.split('/').slice(-4).join('/')}`)
              }
            />
            <TextInputButton
              type="button"
              onClick={() =>
                navigate(`/${githubURL.split('/').slice(-4).join('/')}`)
              }
            >
              {'>'}
            </TextInputButton>
          </TextInputContainer>
        </TopArea>
        <TopArea position="center">
          <SplitModeToggle
            splitMode={splitMode}
            onChangeSplitMode={(mode) => onChangeSplitMode(mode)}
          />
        </TopArea>
        <TopArea position="flex-end">
          <SendButton disabled={isSendDisabled} onClick={() => onSend()}>
            {splitMode}!
          </SendButton>
        </TopArea>
      </Content>
    </Container>
  );
}

export default TopBar;
