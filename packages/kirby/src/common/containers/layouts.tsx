import styled from "styled-components";

export const PageLayout = styled.div`
  background-color: #ffffff;
  border-radius: 4px 4px 4px;
  box-shadow: 0 2px 8px 0 rgba(128, 128, 128, 0.5);
  width: 375px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
`;

export const CenteredPage = styled(PageLayout)`
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;

export const SwitchAuthTypeDiv = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
`;

export const WaitingForConnectionDiv = styled.div`
  display: flex;
  height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;
