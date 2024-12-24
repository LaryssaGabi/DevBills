// import { InputNumberFormat } from '@react-input/number-format';
import { styled } from 'styled-components';
import { Settings } from 'lucide-react';
// import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.75rem;
  }
`;

export const StyledIcon = styled(Settings)`
  cursor: 'pointer';
  color: #797877;
  font-size: 1.2rem;

    &:hover {
      color: #3e3d3d;
    }
`;

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-top: 1rem;
  align-items: flex-start;

`;


