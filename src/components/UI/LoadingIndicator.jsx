export default function LoadingIndicator({ customClass }) {
  return (
    <div className={`d-flex justify-center ${customClass}`}>
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
