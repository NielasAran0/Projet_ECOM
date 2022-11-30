package com.im2ag.ecom.web.rest;

import com.im2ag.ecom.domain.AppUser;
import com.im2ag.ecom.repository.AppUserRepository;
import com.im2ag.ecom.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.im2ag.ecom.domain.AppUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AppUserResource {

    private final Logger log = LoggerFactory.getLogger(AppUserResource.class);

    private static final String ENTITY_NAME = "appUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppUserRepository appUserRepository;

    public AppUserResource(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    /**
     * {@code POST  /app-users} : Create a new appUser.
     *
     * @param appUser the appUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appUser, or with status {@code 400 (Bad Request)} if the appUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/app-users")
    public ResponseEntity<AppUser> createAppUser(@RequestBody AppUser appUser) throws URISyntaxException {
        log.debug("REST request to save AppUser : {}", appUser);
        if (appUser.getId() != null) {
            throw new BadRequestAlertException("A new appUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppUser result = appUserRepository.save(appUser);
        return ResponseEntity
            .created(new URI("/api/app-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /app-users/:id} : Updates an existing appUser.
     *
     * @param id the id of the appUser to save.
     * @param appUser the appUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUser,
     * or with status {@code 400 (Bad Request)} if the appUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/app-users/{id}")
    public ResponseEntity<AppUser> updateAppUser(@PathVariable(value = "id", required = false) final Long id, @RequestBody AppUser appUser)
        throws URISyntaxException {
        log.debug("REST request to update AppUser : {}, {}", id, appUser);
        if (appUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppUser result = appUserRepository.save(appUser);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /app-users/:id} : Partial updates given fields of an existing appUser, field will ignore if it is null
     *
     * @param id the id of the appUser to save.
     * @param appUser the appUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appUser,
     * or with status {@code 400 (Bad Request)} if the appUser is not valid,
     * or with status {@code 404 (Not Found)} if the appUser is not found,
     * or with status {@code 500 (Internal Server Error)} if the appUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/app-users/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppUser> partialUpdateAppUser(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AppUser appUser
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppUser partially : {}, {}", id, appUser);
        if (appUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appUser.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appUserRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppUser> result = appUserRepository
            .findById(appUser.getId())
            .map(existingAppUser -> {
                if (appUser.getEmail() != null) {
                    existingAppUser.setEmail(appUser.getEmail());
                }
                if (appUser.getFirstName() != null) {
                    existingAppUser.setFirstName(appUser.getFirstName());
                }
                if (appUser.getLastName() != null) {
                    existingAppUser.setLastName(appUser.getLastName());
                }
                if (appUser.getPassword() != null) {
                    existingAppUser.setPassword(appUser.getPassword());
                }
                if (appUser.getTelephone() != null) {
                    existingAppUser.setTelephone(appUser.getTelephone());
                }
                if (appUser.getAdresse() != null) {
                    existingAppUser.setAdresse(appUser.getAdresse());
                }

                return existingAppUser;
            })
            .map(appUserRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appUser.getId().toString())
        );
    }

    /**
     * {@code GET  /app-users} : get all the appUsers.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appUsers in body.
     */
    @GetMapping("/app-users")
    public List<AppUser> getAllAppUsers() {
        log.debug("REST request to get all AppUsers");
        return appUserRepository.findAll();
    }

    /**
     * {@code GET  /app-users/:id} : get the "id" appUser.
     *
     * @param id the id of the appUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/app-users/{id}")
    public ResponseEntity<AppUser> getAppUser(@PathVariable Long id) {
        log.debug("REST request to get AppUser : {}", id);
        Optional<AppUser> appUser = appUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(appUser);
    }

    /**
     * {@code DELETE  /app-users/:id} : delete the "id" appUser.
     *
     * @param id the id of the appUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/app-users/{id}")
    public ResponseEntity<Void> deleteAppUser(@PathVariable Long id) {
        log.debug("REST request to delete AppUser : {}", id);
        appUserRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
