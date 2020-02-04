import * as React from "react";
import styled from "styled-components";

import { buttonSizes, TextInput, DarkButton, BorderlessButton } from "@joincivil/elements";

const EMAIL_REGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

const StyledAccountForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export interface AccountFormProps {
  cta: string;
  confirmPassword?: boolean;
  checkPassword(username: string, password: string): Promise<void>;
  onBackClicked(): void;
  onSuccess?(): void;
}

export const AccountForm: React.FunctionComponent<AccountFormProps> = ({
  cta,
  checkPassword,
  confirmPassword,
  onBackClicked,
  onSuccess,
}) => {
  const [email, setEmail] = React.useState<string>("");
  const [emailInvalid, setEmailInvalid] = React.useState<string | undefined>();
  const [password, setPassword] = React.useState<string>("");
  const [passwordInvalid, setPasswordInvalid] = React.useState<string | undefined>();
  const [confirm, setConfirmPassword] = React.useState<string>("");
  const [confirmInvalid, setConfirmInvalid] = React.useState<string | undefined>();

  const [error, setError] = React.useState<string | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);

  async function doOnSubmit(e: any): Promise<void> {
    e.preventDefault();
    setError(undefined);

    setLoading(true);
    try {
      await checkPassword(email, password);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.log("err", err);
      setError(err.message);
    }
    setLoading(false);
  }

  function handleChange(key: string, val: string): void {
    switch (key) {
      case "email":
        setEmail(val);
        const emailMatch = val.match(EMAIL_REGEX);
        if (!emailMatch) {
          setEmailInvalid("This does not appear to be a valid email");
        } else {
          setEmailInvalid(undefined);
        }
        break;
      case "password":
        setPassword(val);
        const passwordMatch = val.match(PASSWORD_REGEX);
        if (!passwordMatch) {
          setPasswordInvalid(
            `Password must be greater than 8 characters, and contain at least 1 number and 1 special character`,
          );
        } else {
          setPasswordInvalid(undefined);
        }
        break;
      case "password-confirm":
        setConfirmPassword(val);
        if (val !== password) {
          setConfirmInvalid("Passwords do not match");
        } else {
          setConfirmInvalid(undefined);
        }
        break;
    }
  }

  const valid =
    emailInvalid === undefined &&
    confirmInvalid === undefined &&
    passwordInvalid === undefined &&
    password !== "" &&
    ((confirmPassword && confirm !== "") || !confirmPassword) &&
    email !== "";

  return (
    <StyledAccountForm>
      <TextInput
        type="text"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder="Email address"
        disabled={loading}
        invalid={emailInvalid !== undefined}
        invalidMessage={emailInvalid}
      />
      <TextInput
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
        placeholder="Password"
        disabled={loading}
        invalid={passwordInvalid !== undefined}
        invalidMessage={passwordInvalid}
      />
      {confirmPassword ? (
        <TextInput
          type="password"
          name="password-confirm"
          value={confirm}
          onChange={handleChange}
          placeholder="Confirm"
          disabled={loading}
          invalid={confirmInvalid !== undefined}
          invalidMessage={confirmInvalid}
        />
      ) : null}
      {error ? <div>{error}</div> : undefined}
      <div>
        <BorderlessButton size={buttonSizes.SMALL} onClick={onBackClicked}>
          Back
        </BorderlessButton>
        <DarkButton onClick={doOnSubmit} disabled={!valid || loading} size={buttonSizes.SMALL}>
          {cta}
        </DarkButton>
      </div>

      {loading ? <div>loading...</div> : undefined}
    </StyledAccountForm>
  );
};
