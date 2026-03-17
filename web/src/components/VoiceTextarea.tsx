import { useCallback } from "react";
import { Mic, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

function RecordingIndicator() {
  return (
    <span className="relative flex h-4 w-4">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
      <span className="relative inline-flex h-4 w-4 rounded-full bg-red-500" />
    </span>
  );
}

type VoiceTextareaProps = React.ComponentProps<"textarea"> & {
  onValueChange?: (value: string) => void;
};

export function VoiceTextarea({ onValueChange, ...textareaProps }: VoiceTextareaProps) {
  const handleTranscript = useCallback(
    (text: string) => {
      if (!onValueChange) return;
      const current = (textareaProps.value as string) || "";
      const separator = current && !current.endsWith(" ") ? " " : "";
      onValueChange(current + separator + text);
    },
    [onValueChange, textareaProps.value]
  );

  const { state, error, toggleRecording } = useVoiceRecorder(handleTranscript);

  return (
    <div className="relative">
      <Textarea {...textareaProps} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={toggleRecording}
        disabled={state === "transcribing"}
        className="absolute bottom-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        title={
          state === "recording"
            ? "Arreter l'enregistrement"
            : state === "transcribing"
              ? "Transcription en cours..."
              : "Dicter avec le microphone"
        }
      >
        {state === "recording" ? (
          <RecordingIndicator />
        ) : state === "transcribing" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
