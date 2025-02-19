package com.trd.match.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "matches")
public class Match {
    @Id
    private String id;
    private String homeTeam;
    private String awayTeam;
    private LocalDateTime date;
    private String status = "scheduled";
    private Score score = new Score();

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getHomeTeam() { return homeTeam; }
    public void setHomeTeam(String homeTeam) { this.homeTeam = homeTeam; }
    
    public String getAwayTeam() { return awayTeam; }
    public void setAwayTeam(String awayTeam) { this.awayTeam = awayTeam; }
    
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public Score getScore() { return score; }
    public void setScore(Score score) { this.score = score; }

    public static class Score {
        private int home = 0;
        private int away = 0;

        public int getHome() { return home; }
        public void setHome(int home) { this.home = home; }
        
        public int getAway() { return away; }
        public void setAway(int away) { this.away = away; }
    }
}
