import React, { useState } from 'react';
import styled from 'styled-components';
import TopBar from '../components/TopBar';

const Page = styled.div`
  background-color: #fafbfc;
`;

const Content = styled.div`
  margin: 0 auto;
  padding-top: 94px;
`;

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin: 12px 16px;
  width: 100%;
`;

function HomeScreen() {
  const [splitMode, setSplitMode] = useState<'split' | 'stack'>('split');

  return (
    <Page>
      <TopBar
        splitMode={splitMode}
        onChangeSplitMode={(sm) => setSplitMode(sm)}
        onSend={() => {}}
        isSendDisabled
      />
      <Content>
        <Card>
          <h1>Github PR Split and Stack</h1>
          <p>Paste in a Github PR url to get started!</p>
          <ul>
            <li>
              <strong>Split:</strong> Move sections of code to merge
              independently of the base branch.
            </li>
            <li>
              <strong>Stack:</strong> Partition code to be reviewed separately,
              then merged back into the base.
            </li>
          </ul>
          <p>
            <em>*See pictures on hover of toggle switch.</em>
          </p>

          <p>
            <a href="/torvalds/linux/pull/8">See an example</a>
          </p>
          <p>
            <a
              href="https://github.com/subsecond-llc/pr-split-stack"
              target="_blank"
              rel="noreferrer"
            >
              File an issue or contribute on Github
            </a>
          </p>
        </Card>
      </Content>
    </Page>
  );
}

export default HomeScreen;
