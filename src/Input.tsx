export type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
}

export default function Input(props: InputProps) {
  return (
    <input type="number" 
        placeholder={props.placeholder || ''}
        className={"border border-white/10 bg-blue-950 p-2 rounded-md " + props.className}
      value = {props.value} 
      onChange={props.onChange} />
  );
}