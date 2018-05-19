import * as React from "react";
import styled from "styled-components";

const StyledLI = styled.li`
display: inline-block;
border: 1px solid transparent;
border-bottom: none;
bottom: -1px;
position: relative;
list-style: none;
padding: 6px 12px;
cursor: pointer;
`;

export interface StyledAProps {
  active: boolean;
}

const StyledA = styled<StyledAProps, "span">("span")`
  ${(props: StyledAProps): string => (props.active ? "text-decoration: underline" : "")};
`;

export interface TabProps {
  tabIndex?: number;
  isActive?: boolean;
  tabText: string;
  onClick?(index: number): () => any;
}

export const Tab = (props: TabProps) => {
    return (
        <StyledLI className="tab">
            <StyledA active={props.isActive ? true : false}
                onClick={(event: any) => {
                    event.preventDefault();
                    props.onClick!(props.tabIndex!);
                }}>
                {props.tabText}
            </StyledA>
        </StyledLI>
    )
}
