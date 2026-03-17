module Api
  module V1
    class TranscriptionsController < ApplicationController
      before_action :require_authentication

      def create
        audio = params[:audio]
        unless audio.is_a?(ActionDispatch::Http::UploadedFile)
          return render json: { error: "Audio file is required" }, status: :unprocessable_entity
        end

        text = GroqTranscriptionService.new(audio, audio.content_type).call
        render json: { text: text }
      rescue => e
        Rails.logger.error("Transcription error: #{e.message}")
        render json: { error: "Transcription failed" }, status: :service_unavailable
      end
    end
  end
end
