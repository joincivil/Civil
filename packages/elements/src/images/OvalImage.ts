import styled from "styled-components";

export interface OvalImageProps {
  height?: number;
  width?: number;
}
export const OvalImage = styled.div`
  background-color: #f1f1f1;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: OvalImageProps) => (props.width ? props.width + "px" : "60px")};
  height: ${(props: OvalImageProps) => (props.height ? props.height + "px" : "60px")};
  > svg {
    width: ${(props: OvalImageProps) => (props.width ? Math.round(props.width * 0.75).toString() + "px" : "40px")};
    height: ${(props: OvalImageProps) => (props.height ? Math.round(props.height * 0.75).toString() + "px" : "40px")};
  }
`;
