import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { lessonById, moduleById } from "../data/curriculum";
import { quizById } from "../data/quiz";
import { useProgress } from "../store/progress";
import { QuizCard } from "../components/QuizPlayer";
import { OpenAnswer } from "../components/OpenAnswer";
import { Card, PageTitle, Btn, Tag } from "../components/ui";

export default function LessonPage() {
  const { lessonId } = useParams();
  const nav = useNavigate();
  const lesson = lessonById[lessonId ?? ""];
  const [stepIdx, setStepIdx] = useState(0);
  const [stepDone, setStepDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const { completeLesson, addCards, touchStreak } = useProgress();

  if (!lesson) return <p>Leçon introuvable.</p>;
  const mod = moduleById[lesson.moduleId];
  const step = lesson.steps[stepIdx];
  const isLast = stepIdx === lesson.steps.length - 1;

  const next = () => {
    if (isLast) {
      completeLesson(lesson.id, lesson.xp);
      addCards(lesson.flashcardIds);
      touchStreak();
      setFinished(true);
    } else {
      setStepIdx(stepIdx + 1);
      setStepDone(false);
    }
  };

  if (finished) {
    return (
      <div className="max-w-xl mx-auto text-center pt-16 fade-up">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold">Leçon terminée !</h1>
        <p className="text-muted mt-2">+{lesson.xp} XP · {lesson.flashcardIds.length} flashcard(s) ajoutée(s) à ta pile de révision.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Btn kind="ghost" onClick={() => nav(`/path/${lesson.moduleId}`)}>← Retour au module</Btn>
          <Btn onClick={() => nav("/flashcards")}>Réviser les cartes →</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link to={`/path/${lesson.moduleId}`} className="text-sm text-muted hover:text-ink">← {mod?.title}</Link>
      <PageTitle title={lesson.title} sub={`Étape ${stepIdx + 1}/${lesson.steps.length} · No Theory Mode : tente d'abord, comprends ensuite.`} />
      <div className="h-1.5 bg-surface2 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-accent2 rounded-full transition-all" style={{ width: `${(stepIdx / lesson.steps.length) * 100}%` }} />
      </div>

      <Card>
        {step.type === "challenge" && (
          <>
            <Tag color="gold">⚡ Challenge d'entrée</Tag>
            <div className="mt-3"><QuizCard key={step.quizId} item={quizById[step.quizId]} source="lesson" onDone={() => setStepDone(true)} /></div>
          </>
        )}
        {step.type === "practice" && (
          <>
            <Tag color="accent">🏋️ Exercice</Tag>
            <div className="mt-3"><QuizCard key={step.quizId} item={quizById[step.quizId]} source="lesson" onDone={() => setStepDone(true)} /></div>
          </>
        )}
        {step.type === "explain" && (
          <div className="fade-up">
            <Tag color="purple">📎 L'essentiel (20% théorie, pas plus)</Tag>
            <h3 className="font-bold text-lg mt-3">{step.title}</h3>
            <p className="text-sm leading-relaxed mt-2 text-ink/90 whitespace-pre-line">{step.body}</p>
            {!stepDone && <div className="mt-4"><Btn onClick={() => setStepDone(true)}>Compris, on pratique →</Btn></div>}
          </div>
        )}
        {step.type === "interview" && (
          <div className="fade-up">
            <Tag color="red">🎤 Question type entretien</Tag>
            <p className="text-lg font-semibold mt-3 mb-4">{step.question}</p>
            <OpenAnswer question={step.question} keywords={step.keywords} modelAnswer={step.modelAnswer} idealLengthWords={[40, 160]} onGraded={() => setStepDone(true)} />
          </div>
        )}
      </Card>

      {stepDone && (
        <div className="mt-4 flex justify-end">
          <Btn onClick={next}>{isLast ? "Terminer la leçon 🎉" : "Continuer →"}</Btn>
        </div>
      )}
    </div>
  );
}
