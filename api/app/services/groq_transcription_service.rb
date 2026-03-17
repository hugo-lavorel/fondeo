require "net/http"
require "json"

class GroqTranscriptionService
  URL = URI("https://api.groq.com/openai/v1/audio/transcriptions")

  def initialize(audio_file, content_type)
    @audio_file = audio_file
    @content_type = content_type
  end

  def call
    api_key = ENV["GROQ_API_KEY"]
    raise "GROQ_API_KEY is not set" unless api_key.present?

    boundary = SecureRandom.hex(16)

    body = build_multipart_body(boundary)

    http = Net::HTTP.new(URL.host, URL.port)
    http.use_ssl = true

    request = Net::HTTP::Post.new(URL)
    request["Authorization"] = "Bearer #{api_key}"
    request["Content-Type"] = "multipart/form-data; boundary=#{boundary}"
    request.body = body

    response = http.request(request)

    unless response.is_a?(Net::HTTPSuccess)
      Rails.logger.error("Groq API error: #{response.code} - #{response.body}")
      raise "Transcription failed: #{response.code}"
    end

    JSON.parse(response.body)["text"]
  end

  private

  def build_multipart_body(boundary)
    parts = []

    # Audio file part
    parts << "--#{boundary}\r\n"
    parts << "Content-Disposition: form-data; name=\"file\"; filename=\"audio.webm\"\r\n"
    parts << "Content-Type: #{@content_type}\r\n\r\n"
    parts << @audio_file.read
    parts << "\r\n"

    # Model part
    parts << "--#{boundary}\r\n"
    parts << "Content-Disposition: form-data; name=\"model\"\r\n\r\n"
    parts << "whisper-large-v3-turbo"
    parts << "\r\n"

    # Language part
    parts << "--#{boundary}\r\n"
    parts << "Content-Disposition: form-data; name=\"language\"\r\n\r\n"
    parts << "fr"
    parts << "\r\n"

    # Response format part
    parts << "--#{boundary}\r\n"
    parts << "Content-Disposition: form-data; name=\"response_format\"\r\n\r\n"
    parts << "json"
    parts << "\r\n"

    parts << "--#{boundary}--\r\n"

    parts.join
  end
end
