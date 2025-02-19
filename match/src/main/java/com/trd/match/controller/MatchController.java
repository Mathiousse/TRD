package com.trd.match.controller;

import com.trd.match.model.Match;
import com.trd.match.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/matches")
@CrossOrigin
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @PostMapping
    public ResponseEntity<?> createMatch(@RequestBody Match match) {
        Match savedMatch = matchRepository.save(match);
        return ResponseEntity.ok(savedMatch);
    }

    @GetMapping
    public ResponseEntity<?> getAllMatches() {
        return ResponseEntity.ok(matchRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMatch(@PathVariable String id) {
        return matchRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
