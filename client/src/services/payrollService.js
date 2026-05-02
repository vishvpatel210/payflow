import api from '../config/axios';

export const processPayroll = async (data) => {
  const response = await api.post('payroll/process', data);
  return response.data;
};

export const getPayrollHistory = async () => {
  const response = await api.get('payroll/history');
  return response.data;
};

export const getCurrentPayroll = async () => {
  const response = await api.get('payroll/current');
  return response.data;
};
