import styled from "styled-components";

export const dappTheme = {
  borderColor: "#cecece",
};

export const PageView = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 1rem 2rem;

  & > * {
    flex: 1;
  }
`;

export const ViewModule = styled.div`
  border: 1px solid #cecece;
  border-radius: 3px;
  margin: 1rem;
  padding: 1rem 1rem 1.5rem;

  & > & {
    border-width: 1px 0 0;
    padding: 1rem 0 0;
    margin:  1rem 0 0;
  }
`;

export const ViewModuleHeader = styled.h3`
  font-size: 1.125rem;
  margin: 0 0 1rem;
`;
