import { Form as AntdForm } from 'antd';
import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
  height: 100%;
  background-color: #f2f2f2;
`;

export const LogoImg = styled.img`
  width: 121px;
  height: 121px;

  background: #333;

  border-radius: 6px;
`;

export const Form = styled(AntdForm)<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
  width: 340px;
`;

export const FormItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

export const FormItem = styled(Form.Item)`
  margin-bottom: 0px;
`;
