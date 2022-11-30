package com.im2ag.ecom.web.rest;

import com.im2ag.ecom.domain.Image;
import com.im2ag.ecom.repository.ImageRepository;
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
 * REST controller for managing {@link com.im2ag.ecom.domain.Image}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ImageResource {

    private final Logger log = LoggerFactory.getLogger(ImageResource.class);

    private static final String ENTITY_NAME = "image";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImageRepository imageRepository;

    public ImageResource(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    /**
     * {@code POST  /images} : Create a new image.
     *
     * @param image the image to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new image, or with status {@code 400 (Bad Request)} if the image has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/images")
    public ResponseEntity<Image> createImage(@RequestBody Image image) throws URISyntaxException {
        log.debug("REST request to save Image : {}", image);
        if (image.getId() != null) {
            throw new BadRequestAlertException("A new image cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Image result = imageRepository.save(image);
        return ResponseEntity
            .created(new URI("/api/images/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /images/:id} : Updates an existing image.
     *
     * @param id the id of the image to save.
     * @param image the image to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated image,
     * or with status {@code 400 (Bad Request)} if the image is not valid,
     * or with status {@code 500 (Internal Server Error)} if the image couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/images/{id}")
    public ResponseEntity<Image> updateImage(@PathVariable(value = "id", required = false) final Long id, @RequestBody Image image)
        throws URISyntaxException {
        log.debug("REST request to update Image : {}, {}", id, image);
        if (image.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, image.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Image result = imageRepository.save(image);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, image.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /images/:id} : Partial updates given fields of an existing image, field will ignore if it is null
     *
     * @param id the id of the image to save.
     * @param image the image to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated image,
     * or with status {@code 400 (Bad Request)} if the image is not valid,
     * or with status {@code 404 (Not Found)} if the image is not found,
     * or with status {@code 500 (Internal Server Error)} if the image couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/images/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Image> partialUpdateImage(@PathVariable(value = "id", required = false) final Long id, @RequestBody Image image)
        throws URISyntaxException {
        log.debug("REST request to partial update Image partially : {}, {}", id, image);
        if (image.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, image.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imageRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Image> result = imageRepository
            .findById(image.getId())
            .map(existingImage -> {
                if (image.getUrl() != null) {
                    existingImage.setUrl(image.getUrl());
                }

                return existingImage;
            })
            .map(imageRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, image.getId().toString())
        );
    }

    /**
     * {@code GET  /images} : get all the images.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of images in body.
     */
    @GetMapping("/images")
    public List<Image> getAllImages() {
        log.debug("REST request to get all Images");
        return imageRepository.findAll();
    }

    /**
     * {@code GET  /images/:id} : get the "id" image.
     *
     * @param id the id of the image to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the image, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/images/{id}")
    public ResponseEntity<Image> getImage(@PathVariable Long id) {
        log.debug("REST request to get Image : {}", id);
        Optional<Image> image = imageRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(image);
    }

    /**
     * {@code DELETE  /images/:id} : delete the "id" image.
     *
     * @param id the id of the image to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/images/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        log.debug("REST request to delete Image : {}", id);
        imageRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
