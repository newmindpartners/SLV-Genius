import { WidgetProps } from '@rjsf/utils';
import TextField from '~/components/TextField/TextField';
import StrategySelector from '~/pages/SmartVaults/components/StrategySelector';
import { SmartVaultStrategy } from '~/redux/api';

const CustomSelectWidget = function (props: WidgetProps) {
  const { id, value, onChange, onBlur, options, label } = props;

  const selectOptions: SmartVaultStrategy[] =
    options.enumOptions?.map((option) => ({
      name: option.label,
      smartVaultStrategyId: option.value,
      created: '',
      description: '',
      configJsonSchema: '',
      numberOfAssetsSupported: 0,
    })) || [];

  return (
    <StrategySelector
      name={id}
      value={value}
      onBlur={(e) => onBlur(id, e.target.value)}
      onChange={onChange}
      options={selectOptions}
      label={label}
    />
  );
};

const CustomTextWidget = function CustomTextWidget(props: WidgetProps) {
  const { label, id, value, onChange, onBlur } = props;

  return (
    <TextField
      label={label}
      name={id}
      value={value || ''}
      onBlur={(e) => onBlur(id, e.target.value)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export const jsonWidgets = {
  SelectWidget: CustomSelectWidget,
  TextWidget: CustomTextWidget,
};
