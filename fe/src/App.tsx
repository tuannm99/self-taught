import { Counter } from './features/counter/Counter';
import './App.css';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  example: string;
  exampleRequired: string;
};

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  console.log(watch('example'));

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input defaultValue="test" {...register('example')} />
        <input {...register('exampleRequired', { required: true })} />
        {errors.exampleRequired && <span>This field is required</span>}
        <input type="submit" />
      </form>

      {/* <header className="App-header"> */}
      {/*   <Counter /> */}
      {/* </header> */}
    </div>
  );
}

export default App;
