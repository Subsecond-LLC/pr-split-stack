import React from 'react';
import styled from 'styled-components';
import Card from '../ui/Card';

const Modal = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalCardArea = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 200px auto;
`;

function LoadingModal({
  message,
  pullRequestURL,
}: {
  message: string;
  pullRequestURL: string | null;
}) {
  return (
    <Modal>
      <ModalCardArea>
        <Card>
          <h2>{pullRequestURL == null ? 'Loading...' : 'Congratulations'}</h2>
          <p>{message}</p>
          {pullRequestURL != null && (
            <p>
              <a href={pullRequestURL}>Go to newly generated pull request</a>
            </p>
          )}
        </Card>
      </ModalCardArea>
    </Modal>
  );
}

export default LoadingModal;
