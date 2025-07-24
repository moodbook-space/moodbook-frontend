import { StarFilled, StarOutlined } from '@ant-design/icons';
import { CSSProperties } from 'react';
import styled from 'styled-components';

const MAX_SCORE = 5;

interface ScoreStarsProps {
  /** 0 ~ 10 */
  reputation: number;
}
export const ScoreStars = (props: ScoreStarsProps) => {
  const { reputation } = props;

  const filledStarCount = Math.floor(reputation / 2);
  const outlinedStarCount = MAX_SCORE - filledStarCount;

  return (
    <Container>
      {Array.from({ length: filledStarCount }).map((_, index) => (
        <StarFilled key={index} style={StarStyles} />
      ))}
      {Array.from({ length: outlinedStarCount }).map((_, index) => (
        <StarOutlined key={index} style={StarStyles} />
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 4px;
`;

const StarStyles: CSSProperties = {
  color: '#FFD400',
};
