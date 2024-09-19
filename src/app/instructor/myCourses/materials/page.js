import MaterialPage from "@/components/instructor components/material";
import QuizPage from "@/components/instructor components/quiz";

const Material = () => {
  return (
    <div>
      <div className='relative w-screen mt-4 flex'>
      <MaterialPage/>
    </div>
    <QuizPage />
    </div>
  )
}

export default Material;