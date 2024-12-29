import { css, styled } from "styled-components";
import { theme } from "../../styles/theme";

type ContainerProps = {
    $variant: 'default' | 'outline' | 'text';
}

export const Container = styled.button<ContainerProps>`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 2.25rem;
    border-radius: 0.25rem;
    background-color: ${(props) =>
        props.$variant === 'default' ? theme.colors.primary : 'transparent'};
    color: ${(props) =>
        props.$variant === 'default'
            ? theme.colors.black
            : props.$variant === 'outline'
            ? theme.colors.primary
            : theme.colors.primary};
    border: 0;
    padding: ${(props) =>
        props.$variant === 'text' ? '0' : '0 0.75rem'};
    transition: all 100ms;

    ${(props) => props.$variant === 'outline' && css`
        border: 1px solid ${theme.colors.primary};
    `}

    ${(props) =>
        props.$variant === 'text' &&
        css`
            border: none;
            background-color: transparent;
            color: ${theme.colors.primary};
            padding: 0; 
            height: auto;

            &:hover {
                color: ${theme.colors.primaryDarck};
            }
        `}

    &:hover{
        background-color: ${theme.colors.primaryDarck};
    }
`;
