import { Mood } from '../../constants';
import { Button } from './MoodButton.styles';

interface MoodButtonProps {
  selected: boolean;
  text: Mood;
  color: string;
  onClick: () => void;
}
export const MoodButton = (props: MoodButtonProps) => {
  const { selected, color, text, onClick } = props;
  return (
    <Button $selected={selected} $backgroundColor={color} onClick={onClick}>
      {text}
    </Button>
  );
};
