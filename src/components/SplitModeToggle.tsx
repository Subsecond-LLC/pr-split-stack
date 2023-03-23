import React, { useState } from 'react';
import styled from 'styled-components';
import splitDiagram from '../assets/split.png';
import stackDiagram from '../assets/stack.png';

const SPLIT_COLOR = '#9673A6';
const STACK_COLOR = '#82B366';

const Container = styled.div`
  position: relative;
`;

const FullSwitch = styled.div`
  border: 2px solid #ddd;
  border-radius: 20px;
  height: 40px;
  padding: 1px;
  width: 162px;
  margin: 0 auto;

  display: flex;
  flex-direction: row;
`;

const SwitchButton = styled.div<{
  selected: boolean;
  highlightColor: string;
  first?: boolean;
}>`
  font-size: 20px;
  padding: 6px;
  width: 80px;
  text-align: center;
  border-radius: 18px;
  font-weight: 500;
  cursor: pointer;

  border-radius: ${({ first }) => (first ? '18px 0 0 18px' : '0 18px 18px 0')};

  ${({ selected, highlightColor }) =>
    selected
      ? `
    color: white;
    background-color: ${highlightColor};

    :hover {
      color: #eee;
    }
  `
      : `
    background-color: white;
    border: 3px solid ${highlightColor};
    padding: 3px;
    color: ${highlightColor};

    : hover {
      background-color: #eee;
    }
  `}
`;

const GuideContainer = styled.div`
  position: absolute;
  top: 44px;
  left: -248px;

  display: flex;
  flex-direction: row;

  padding: 8px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

const GuideImage = styled.img<{ selected: boolean; highlightColor: string }>`
  cursor: pointer;
  margin: 8px;
  border: 2px solid
    ${({ selected, highlightColor }) => (selected ? highlightColor : '#eee')};
`;

function SplitModeToggle({
  splitMode,
  onChangeSplitMode,
}: {
  splitMode: 'split' | 'stack';
  onChangeSplitMode: (mode: 'split' | 'stack') => void;
}) {
  const [shouldShowGuide, setShouldShowGuide] = useState<boolean>(false);

  return (
    <Container
      onMouseEnter={() => setShouldShowGuide(true)}
      onMouseLeave={() => setShouldShowGuide(false)}
    >
      <FullSwitch>
        <SwitchButton
          first
          selected={splitMode === 'split'}
          highlightColor={SPLIT_COLOR}
          onClick={() =>
            onChangeSplitMode(splitMode === 'split' ? 'stack' : 'split')
          }
        >
          Split
        </SwitchButton>
        <SwitchButton
          selected={splitMode === 'stack'}
          highlightColor={STACK_COLOR}
          onClick={() =>
            onChangeSplitMode(splitMode === 'split' ? 'stack' : 'split')
          }
        >
          Stack
        </SwitchButton>
      </FullSwitch>
      {shouldShowGuide && (
        <GuideContainer>
          <GuideImage
            selected={splitMode === 'split'}
            highlightColor={SPLIT_COLOR}
            src={splitDiagram}
            alt="A split PR will independently merge into main separate from the base."
            onClick={() => onChangeSplitMode('split')}
          />
          <GuideImage
            selected={splitMode === 'stack'}
            highlightColor={STACK_COLOR}
            src={stackDiagram}
            alt="A stacked PR will merge back into the base before merging to main."
            onClick={() => onChangeSplitMode('stack')}
          />
        </GuideContainer>
      )}
    </Container>
  );
}

export default SplitModeToggle;
