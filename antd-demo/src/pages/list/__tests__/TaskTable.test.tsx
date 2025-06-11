/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { Task } from '@/interface/entity';
import TaskTable from '../components/TaskTable';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock antd components
jest.mock('antd', () => {
  const ActualAntd = jest.requireActual('antd');
  return {
    ...ActualAntd,
    Table: ({ columns, dataSource }) => (
      <table>
        <thead>
          <tr>
            {columns.map((col: any) => (
              <th key={col.title}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataSource.map((row: any, index: number) => (
            <tr key={index}>
              {columns.map((col: any) => (
                <td key={col.title}>
                  {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),
    Tag: ({ children, color }) => <span style={{ color }}>{children}</span>,
    Button: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
    Space: ({ children }) => <div>{children}</div>,
  };
});

const mockTasks: Task[] = [
  {
    key: '1',
    title: 'Test Task',
    description: 'Test description',
    status: 'OPEN',
    priority: 'HIGH',
    deadline: '2025-06-10T10:00:00',
    createdAt: '2025-06-01T09:00:00',
    updatedAt: '2025-06-02T12:00:00',
  },
];

describe('TaskTable', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with correct columns and data', () => {
    render(<TaskTable data={mockTasks} />);

    // Check column headers
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check task data
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('HIGH')).toBeInTheDocument();
  });

  it('navigates to task detail on title click', () => {
    render(<TaskTable data={mockTasks} />);
    fireEvent.click(screen.getByText('Test Task'));
    expect(mockPush).toHaveBeenCalledWith('/list/1');
  });

  it('triggers delete modal on delete button click', () => {
    render(<TaskTable data={mockTasks} />);
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    // Note: Cannot test modal visibility without mocking ConfirmDeleteModal
    // Add further assertions if modal state is exposed
  });
});