package se.umu.cs.pvt.usersettings;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interface for the UserSettingsRepository.
 */
@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
}
