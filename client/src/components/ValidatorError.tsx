type ValidatorErrorProps = {
  error?: string;
};

export const ValidatorError = (props: ValidatorErrorProps) => {
  return (
    <p
      className={`mt-1 text-xs text-error`}
    >
      {props.error ?? "\u00A0"}
    </p>
  );
}
