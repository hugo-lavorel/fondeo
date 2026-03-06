class Rack::Attack
  # Throttle login attempts by IP
  throttle("login/ip", limit: 10, period: 60.seconds) do |req|
    req.ip if req.path == "/api/v1/login" && req.post?
  end

  # Throttle login attempts by email
  throttle("login/email", limit: 5, period: 60.seconds) do |req|
    if req.path == "/api/v1/login" && req.post?
      begin
        JSON.parse(req.body.read).dig("session", "email").to_s.downcase.strip
      rescue
        nil
      ensure
        req.body.rewind
      end
    end
  end

  # Throttle signup attempts by IP
  throttle("signup/ip", limit: 5, period: 60.seconds) do |req|
    req.ip if req.path == "/api/v1/signup" && req.post?
  end

  self.throttled_responder = lambda do |req|
    retry_after = (req.env["rack.attack.match_data"] || {})[:period]
    [
      429,
      { "Content-Type" => "application/json", "Retry-After" => retry_after.to_s },
      [ { error: "Too many requests. Try again later." }.to_json ]
    ]
  end
end
