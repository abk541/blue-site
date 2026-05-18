import NumberField from './NumberField';
import TextField from './TextField';

export default function FormField(props) {
  if (props.field.type === 'text') {
    return <TextField {...props} />;
  }

  return <NumberField {...props} />;
}
