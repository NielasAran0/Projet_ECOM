package com.im2ag.ecom.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Product entity.
 */
@Schema(description = "The Product entity.")
@Entity
@Table(name = "product")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Product implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "cart", "orders", "posts" }, allowSetters = true)
    private AppUser seller;

    @ManyToMany
    @JoinTable(
        name = "rel_product__categories",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "categories_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_product__images",
        joinColumns = @JoinColumn(name = "product_id"),
        inverseJoinColumns = @JoinColumn(name = "images_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "products" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @JsonIgnoreProperties(value = { "product", "appUser" }, allowSetters = true)
    @OneToOne(mappedBy = "product")
    private SalesPost salespost;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Product id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Product name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Product description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AppUser getSeller() {
        return this.seller;
    }

    public void setSeller(AppUser appUser) {
        this.seller = appUser;
    }

    public Product seller(AppUser appUser) {
        this.setSeller(appUser);
        return this;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Product categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Product addCategories(Category category) {
        this.categories.add(category);
        category.getProducts().add(this);
        return this;
    }

    public Product removeCategories(Category category) {
        this.categories.remove(category);
        category.getProducts().remove(this);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        this.images = images;
    }

    public Product images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Product addImages(Image image) {
        this.images.add(image);
        image.getProducts().add(this);
        return this;
    }

    public Product removeImages(Image image) {
        this.images.remove(image);
        image.getProducts().remove(this);
        return this;
    }

    public SalesPost getSalespost() {
        return this.salespost;
    }

    public void setSalespost(SalesPost salesPost) {
        if (this.salespost != null) {
            this.salespost.setProduct(null);
        }
        if (salesPost != null) {
            salesPost.setProduct(this);
        }
        this.salespost = salesPost;
    }

    public Product salespost(SalesPost salesPost) {
        this.setSalespost(salesPost);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Product)) {
            return false;
        }
        return id != null && id.equals(((Product) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Product{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
