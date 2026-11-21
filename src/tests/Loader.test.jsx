import { render, screen } from '@testing-library/react';
import { Loader } from '../components/Loader';

describe('Loader', () => {
  it('отображает текст и спиннер', () => {
    const { container } = render(<Loader />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});